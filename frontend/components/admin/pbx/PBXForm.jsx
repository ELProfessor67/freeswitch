"use client";
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const PBXForm = ({ pbx, open, onOpenChange, onSubmit }) => {
  const { toast } = useToast();
  const [name, setName] = useState(pbx?.name || '');
  const [host, setHost] = useState(pbx?.host || '');
  const [sipPort, setSipPort] = useState(pbx?.sipPort?.toString() || '');
  const [wssPort, setWssPort] = useState(pbx?.wssPort?.toString() || '');

  useEffect(() => {
    if (pbx) {
      setName(pbx.name);
      setHost(pbx.SIP_HOST);
      setSipPort(pbx.SIP_PORT?.toString() || '');
      setWssPort(pbx.WSS_POST?.toString() || '');
    } else {
      setName('');
      setHost('');
      setSipPort('');
      setWssPort('');
    }
  }, [pbx, open]);

  const validatePort = (port) => {
    const numPort = parseInt(port);
    return !isNaN(numPort) && numPort > 0 && numPort <= 65535;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !host.trim()) {
      toast("Name And Host are Required.");
      return;
    }

    const pbxData = {
      name,
      SIP_HOST: host,
      SIP_PORT: sipPort,
      WSS_POST: wssPort,
      update: !!pbx,
      id: pbx?.id
    };

    onSubmit(pbxData);
    onOpenChange(false);

    toast(pbx ? "PBX Server Updated" : "PBX Server Created");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle>{pbx ? 'Edit PBX Server' : 'Create New PBX Server'}</DialogTitle>
          <DialogDescription>
            Configure your PBX server settings. All fields are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Enter PBX Server Name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="host">Host</Label>
              <Input
                id="host"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                type="text"
                placeholder="Enter Host Address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sipPort">SIP Port</Label>
              <Input
                id="sipPort"
                value={sipPort}
                onChange={(e) => setSipPort(e.target.value)}
                type="number"
                min="1"
                max="65535"
                placeholder="Enter SIP Port"
              
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wssPort">WSS Port</Label>
              <Input
                id="wssPort"
                value={wssPort}
                onChange={(e) => setWssPort(e.target.value)}
                type="number"
                min="1"
                max="65535"
                placeholder="Enter WSS Port"
                
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {pbx ? 'Update PBX Server' : 'Create PBX Server'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PBXForm;
