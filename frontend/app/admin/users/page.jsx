"use client"
import React, { useEffect } from 'react';
import UserTable, { User } from '@/components/admin/users/UserTable';
import UserForm from '@/components/admin/users/UserForm';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createRequest, deleteRequest, getRequest, updateRequest } from '@/http/userHttp';



const Users = () => {
  const { toast } = useToast();
  const [users, setUsers] = React.useState([]);
  const [formOpen, setFormOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(undefined);

  const handleCreateUser = () => {
    setSelectedUser(undefined);
    setFormOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormOpen(true);
  };

  const handleDeleteUser = async (user) => {
    const res = await deleteRequest(user.username)
    await getUser()
    toast({
      title: "User deleted",
      description: `${user.name} has been removed.`,
      status: "success"
    });
  };

  const handleSubmitUser = async (userData) => {
    if (userData.update) {
      const res = await updateRequest(userData, userData.username1)

      toast({
        title: "User updated",
        description: `${userData.username} has been updated.`,
        status: "success"
      });
    } else {

      const res = await createRequest(userData)
      toast({
        title: "User created",
        description: `${userData.username} has been added.`,
        status: "success"
      });
    }
    await getUser()
    setFormOpen(false);
  };

  const getUser = async () => {
    try {
      const res = await getRequest();
      setUsers(res.data.users)
    } catch (error) {
      console.log(error?.message);
    }
  }

  useEffect(() => {
    getUser()
  },[])

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Users Management</h1>
        <Button onClick={handleCreateUser} className="bg-admin-primary hover:bg-admin-primary/90 text-white">
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
      />
    </div>
  );
};

export default Users;
