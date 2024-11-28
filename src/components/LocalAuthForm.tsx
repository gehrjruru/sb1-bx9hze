import React, { useState } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface LocalAuthFormProps {
  onSubmit: (data: { ipAddress: string; username: string; password: string }) => void;
  loading: boolean;
}

export function LocalAuthForm({ onSubmit, loading }: LocalAuthFormProps) {
  const [formData, setFormData] = useState({
    ipAddress: '',
    username: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Local IP Address"
        id="ipAddress"
        name="ipAddress"
        type="text"
        placeholder="192.168.1.1"
        value={formData.ipAddress}
        onChange={handleChange}
        required
      />

      <Input
        label="Username"
        id="username"
        name="username"
        type="text"
        placeholder="admin"
        value={formData.username}
        onChange={handleChange}
        required
      />

      <Input
        label="Password"
        id="password"
        name="password"
        type="password"
        placeholder="Enter password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <Button
        type="submit"
        loading={loading}
        loadingText="Connecting..."
      >
        Connect to Local Network
      </Button>
    </form>
  );
}