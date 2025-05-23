"use client"
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';

const CreateUser = () => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [sipId, setSipId] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [createSIP, setCreateSIP] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      toast({
        title: "Error",
        description: "Name and email are required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would send data to the backend
    toast({
      title: "User Created",
      description: `${name} has been added successfully.${createSIP ? ' SIP credentials generated.' : ''}`,
    });
    
    // Reset form
    setName('');
    setEmail('');
    setRole('user');
    setSipId('');
    setIsActive(true);
    setPassword('');
    setConfirmPassword('');
    setCreateSIP(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Create User</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>New User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input 
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">User Role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="agent">Call Agent</SelectItem>
                      <SelectItem value="user">Regular User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="createSIP">Create SIP Account</Label>
                    <Switch 
                      checked={createSIP} 
                      onCheckedChange={setCreateSIP}
                      id="createSIP" 
                    />
                  </div>
                  
                  {createSIP && (
                    <div className="pt-4 space-y-2">
                      <Label htmlFor="sipId">SIP ID (Optional)</Label>
                      <Input 
                        id="sipId"
                        value={sipId}
                        onChange={(e) => setSipId(e.target.value)}
                        placeholder="Leave empty for auto-generation"
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 pt-4">
                  <Switch 
                    checked={isActive} 
                    onCheckedChange={setIsActive}
                    id="active-status" 
                  />
                  <Label htmlFor="active-status">
                    User will be {isActive ? 'active' : 'inactive'} after creation
                  </Label>
                </div>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button type="submit" className="bg-admin-primary hover:bg-admin-primary/90">
                Create User {createSIP && '& Generate SIP'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateUser;
