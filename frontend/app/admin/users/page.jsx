"use client"
import React from 'react';
import UserTable, { User } from '@/components/admin/users/UserTable';
import UserForm from '@/components/admin/users/UserForm';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Sample data
const initialUsers = [
  { 
    id: '1', 
    name: 'John Doe', 
    email: 'john@example.com', 
    role: 'admin', 
    createdAt: '2023-10-01', 
    status: 'active' 
  },
  { 
    id: '2', 
    name: 'Jane Smith', 
    email: 'jane@example.com', 
    role: 'agent', 
    sipId: 'SIP001', 
    createdAt: '2023-10-15', 
    status: 'active' 
  },
  { 
    id: '3', 
    name: 'Robert Johnson', 
    email: 'robert@example.com', 
    role: 'agent', 
    sipId: 'SIP002', 
    createdAt: '2023-11-05', 
    status: 'active' 
  },
  { 
    id: '4', 
    name: 'Sarah Williams', 
    email: 'sarah@example.com', 
    role: 'user', 
    createdAt: '2023-11-20', 
    status: 'inactive' 
  },
  { 
    id: '5', 
    name: 'Michael Brown', 
    email: 'michael@example.com', 
    role: 'manager', 
    createdAt: '2023-12-01', 
    status: 'active' 
  },
  { 
    id: '6', 
    name: 'Emily Davis', 
    email: 'emily@example.com', 
    role: 'agent', 
    sipId: 'SIP003', 
    createdAt: '2023-12-10', 
    status: 'active' 
  },
  { 
    id: '7', 
    name: 'David Miller', 
    email: 'david@example.com', 
    role: 'user', 
    createdAt: '2024-01-05', 
    status: 'inactive' 
  },
  { 
    id: '8', 
    name: 'Jessica Wilson', 
    email: 'jessica@example.com', 
    role: 'agent', 
    sipId: 'SIP004', 
    createdAt: '2024-01-15', 
    status: 'active' 
  },
  { 
    id: '9', 
    name: 'Thomas Moore', 
    email: 'thomas@example.com', 
    role: 'user', 
    createdAt: '2024-02-01', 
    status: 'active' 
  },
  { 
    id: '10', 
    name: 'Jennifer Taylor', 
    email: 'jennifer@example.com', 
    role: 'agent', 
    sipId: 'SIP005', 
    createdAt: '2024-02-10', 
    status: 'active' 
  },
];

const Users = () => {
  const { toast } = useToast();
  const [users, setUsers] = React.useState(initialUsers);
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

  const handleDeleteUser = (user) => {
    setUsers(users.filter(u => u.id !== user.id));
    toast({
      title: "User deleted",
      description: `${user.name} has been removed.`,
      status: "success"
    });
  };

  const handleSubmitUser = (userData) => {
    if (userData.id) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === userData.id 
          ? { ...user, ...userData } 
          : user
      ));
      toast({
        title: "User updated",
        description: `${userData.name} has been updated.`,
        status: "success"
      });
    } else {
      // Create new user
      const newUser = {
        ...userData,
        id: `${users.length + 1}`,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setUsers([newUser, ...users]);
      toast({
        title: "User created",
        description: `${userData.name} has been added.`,
        status: "success"
      });
    }
    setFormOpen(false);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Users Management</h1>
        <Button onClick={handleCreateUser} className="bg-admin-primary hover:bg-admin-primary/90">
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
