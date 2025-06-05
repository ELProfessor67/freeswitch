"use client";
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

const UserForm = ({ user, open, onOpenChange, onSubmit, pbxs }) => {
  const { toast } = useToast();
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState(user?.password || '');
  const [pbx, setpbx] = useState(user?.pbx_id || '');
  const [extentionNumber, setExtensionNumber] = useState(user?.extension_number || '');
  const [extentionPassword, setExtensionPassword] = useState(user?.extension_password || '');
  const [role, setRole] = useState(user?.role || 'USER');
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setPassword(user.password);
      setpbx(user.pbx.id);
      setExtensionNumber(user.extension_number)
      setExtensionPassword(user.extension_password)
      setRole(user.role);
    } else {
      setpbx('');
      setEmail('');
      setPassword('');
      setExtensionNumber('')
      setExtensionPassword('')
      setRole('')
    }
  }, [user, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim() || !pbx || !extentionNumber || !extentionPassword) {
      toast({
        title: "Error",
        description: "Username and password and PBX are required fields.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true)
    const userData = {
      email,
      password,
      extension_number: extentionNumber,
      extension_password: extentionPassword,
      role: role,
      pbx_id: pbx,
      update: !!user,
      id: user?.id
    };

    await onSubmit(userData);
    onOpenChange(false);

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white border-none shadow-md">
        <DialogHeader>
          <DialogTitle>{user ? 'Edit User' : 'Create New User'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter Email"
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
                placeholder="*********"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="exnumber">Extension Number</Label>
              <Input
                id="exnumber"
                type="text"
                value={extentionNumber}
                onChange={(e) => setExtensionNumber(e.target.value)}
                placeholder="Enter Extension Number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expassword">Extension Password</Label>
              <Input
                id="expassword"
                type="password"
                value={extentionPassword}
                onChange={(e) => setExtensionPassword(e.target.value)}
                placeholder="Enter Extension Password"
                required
              />
            </div>


            <div className="space-y-2">
              <Label htmlFor="password">Role</Label>
              <Select value={role} onValueChange={value => setRole(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent className={"bg-white border-none shadow-md"}>
                  <SelectGroup>
                    <SelectItem value={"USER"}>USER</SelectItem>
                    <SelectItem value={"ADMIN"}>ADMIN</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>



            <div className="space-y-2">
              <Label htmlFor="password">PBX</Label>
              <Select value={pbx} onValueChange={value => setpbx(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select PBX" />
                </SelectTrigger>
                <SelectContent className={"bg-white border-none shadow-md"} >
                  <SelectGroup>
                    {
                      pbxs.map(pbx => (
                        <SelectItem value={pbx.id}>{pbx.name}</SelectItem>
                      ))
                    }
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>



          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {
              loading ?
                <Button type="button">
                  Loading...
                </Button>
                :
                <Button type="submit">
                  {user ? 'Update User' : 'Create User'}
                </Button>
            }

          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog >
  );
};

export default UserForm;
