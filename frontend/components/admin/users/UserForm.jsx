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

const UserForm = ({ user, open, onOpenChange, onSubmit,pbxs }) => {
  const { toast } = useToast();
  const [username, setUsername] = useState(user?.username || '');
  const [password, setPassword] = useState(user?.password || '');
  const [pbx, setpbx] = useState(user?.pbx_id || '');

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setPassword(user.password);
      setpbx(user.pbx.id);
    } else {
      setpbx('');
      setUsername('');
      setPassword('');;
    }
  }, [user, open]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim() || !pbx) {
      toast({
        title: "Error",
        description: "Username and password and PBX are required fields.",
        variant: "destructive",
      });
      return;
    }

    const userData = {
      username,
      password,
      pbx_id: pbx,
      update: !!user,
      id: user?.id
    };

    onSubmit(userData);
    onOpenChange(false);

    toast({
      title: user ? "User Updated" : "User Created",
      description: user
        ? `${username}'s information has been updated.`
        : `${username} has been added successfully.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle>{user ? 'Edit User' : 'Create New User'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="Enter Username"
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
              <Label htmlFor="password">PBX</Label>
              <Select value={pbx} onValueChange={value => setpbx(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select PBX" />
                </SelectTrigger>
                <SelectContent>
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
            <Button type="submit">
              {user ? 'Update User' : 'Create User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserForm;
