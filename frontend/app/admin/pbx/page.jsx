"use client"
import React, { useEffect, useState } from 'react';
import PBXTable from '@/components/admin/pbx/PBXTable';
import PBXForm from '@/components/admin/pbx/PBXForm';
import { Button } from '@/components/ui/button';
import { Server, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createPBXRequest, deletePBXRequest, getAllPBXsRequest, updatePBXRequest } from '@/http/pbxHttp';

const PBXManagement = () => {
  const { toast } = useToast();
  const [formOpen, setFormOpen] = React.useState(false);
  const [selectedPBX, setSelectedPBX] = React.useState(undefined);
  const [pbxs, setPbxs] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleCreatePBX = () => {
    setSelectedPBX(undefined);
    setFormOpen(true);
  };

  const handleEditPBX = (pbx) => {
    setSelectedPBX(pbx);
    setFormOpen(true);
  };

  const handleDeletePBX = async (pbx) => {
    try {
      await deletePBXRequest(pbx.id);
      toast({
        title: "PBX Server Deleted",
        description: `${pbx.name} has been removed.`,
      });
      await getPBXs();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete PBX server",
        status: "error"
      });
    }
  };

  const handleSubmitPBX = async (pbxData) => {
    console.log(pbxData,"hello")
    try {
      if (pbxData.update) {
        const res = await updatePBXRequest(pbxData.id, pbxData);
        toast({
          title: "PBX Server Updated",
          description: `${pbxData.name} has been updated.`,
          status: "success"
        });
      } else {
        const res = await createPBXRequest(pbxData);
        toast({
          title: "PBX Server Created",
          description: `${pbxData.name} has been added.`,
          status: "success"
        });
      }
      await getPBXs();
      setFormOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save PBX server",
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
        description: error.message || "Failed to fetch PBX servers",
        status: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPBXs();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">PBX Servers</h1>
        <Button 
          onClick={handleCreatePBX} 
          className="bg-admin-primary hover:bg-admin-primary/90 text-white"
          disabled={loading}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add PBX Server
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <PBXTable
            users={pbxs}
            onEdit={handleEditPBX}
            onDelete={handleDeletePBX}
          />
        </div>
      </div>

      <PBXForm
        pbx={selectedPBX}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmitPBX}
        loading={loading}
      />
    </div>
  );
};

export default PBXManagement;
