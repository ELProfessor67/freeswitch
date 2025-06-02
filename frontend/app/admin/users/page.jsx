"use client"
import React, { useEffect, useState } from 'react';
import UserTable, { User } from '@/components/admin/users/UserTable';
import UserForm from '@/components/admin/users/UserForm';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createRequest, deleteRequest, getRequest, updateRequest } from '@/http/userHttp';
import { getAllPBXsRequest } from '@/http/pbxHttp';

const Users = () => {
  const { toast } = useToast();
  const [users, setUsers] = React.useState([]);
  const [formOpen, setFormOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(undefined);
  const [pbxs, setPbxs] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleCreateUser = () => {
    setSelectedUser(undefined);
    setFormOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormOpen(true);
  };

  const handleDeleteUser = async (user) => {
    try {
      const res = await deleteRequest(user.id);
      await getUser();
      toast({
        title: "User deleted",
        description: `${user.name} has been removed.`,
        status: "success"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        status: "error"
      });
    }
  };

  const handleSubmitUser = async (userData) => {
    try {
      if (userData.update) {
        const res = await updateRequest(userData, userData.id);
        toast({
          title: "User updated",
          description: `${userData.username} has been updated.`,
          status: "success"
        });
      } else {
        const res = await createRequest(userData);
        toast({
          title: "User created",
          description: `${userData.username} has been added.`,
          status: "success"
        });
      }
      await getUser();
      setFormOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save user",
        status: "error"
      });
    }
  };

  const getUser = async () => {
    try {
      const res = await getRequest();
      setUsers(res.data.users);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch users",
        status: "error"
      });
    }
  };

  const getPBXs = async () => {
    try {
      setLoading(true);
      const response = await getAllPBXsRequest();
      setPbxs(response.data.pbxs);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch PBXs",
        status: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
    getPBXs();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Users Management</h1>
        <Button 
          onClick={handleCreateUser} 
          className="bg-admin-primary hover:bg-admin-primary/90 text-white"
          disabled={loading || pbxs.length === 0}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Create User
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <UserTable
            users={users}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        </div>
      </div>

      <UserForm
        user={selectedUser}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmitUser}
        pbxs={pbxs}
        loading={loading}
      />
    </div>
  );
};

export default Users;
