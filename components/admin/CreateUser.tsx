"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardBody, CardHeader, Input, Select, SelectItem, Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { UserPostResponse } from '@app/api/users/route';
import { FiUsers } from 'react-icons/fi';

export default function CreateUser(props?: { onUserCreated?: () => void }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const { data } = await axios.post<UserPostResponse>('/api/users', formData);
      if (data.response === 'success') {
        // Reset form
        setFormData({ name: '', email: '', password: '', role: 'USER' });
        // Call callback if provided, otherwise redirect
        if (props?.onUserCreated) {
          props.onUserCreated();
        } else {
          router.push('/admin');
        }
      } else {
        setErrorMessage(data.error || 'Failed to create user');
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || err.message || 'Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card className="admin-gradient-card border-white/20 shadow-lg backdrop-blur-md">
        <CardHeader className="bg-white/5 border-b border-white/10 p-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            New User
          </h3>
        </CardHeader>
        <CardBody className="p-6 space-y-4">
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
            variant="bordered"
            className="bg-white/10 text-white border-white/20"
            isInvalid={!!errorMessage && formData.name === ''}
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="user@example.com"
            variant="bordered"
            className="bg-white/10 text-white border-white/20"
            isInvalid={!!errorMessage && formData.email === ''}
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter secure password"
            variant="bordered"
            className="bg-white/10 text-white border-white/20"
            isInvalid={!!errorMessage && formData.password === ''}
          />
          <Select
            label="Role"
            name="role"
            selectedKeys={[formData.role]}
            onSelectionChange={(keys) => setFormData(prev => ({ ...prev, role: Array.from(keys)[0] as string }))}
            variant="bordered"
            className="bg-white/10 text-white border-white/20"
          >
            <SelectItem key="USER" value="USER">User</SelectItem>
            <SelectItem key="STAFF" value="STAFF">Staff</SelectItem>
            <SelectItem key="ADMIN" value="ADMIN">Admin</SelectItem>
          </Select>
        </CardBody>
        <div className="p-6 pt-0">
          <Button
            type="submit"
            color="primary"
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-lg"
            isLoading={isLoading}
            startContent={isLoading ? null : <FiUsers size={18} />}
          >
            {isLoading ? 'Creating...' : 'Create User'}
          </Button>
          {errorMessage && (
            <p className="text-danger mt-3 text-sm text-center">{errorMessage}</p>
          )}
        </div>
      </Card>
    </form>
  );
}
