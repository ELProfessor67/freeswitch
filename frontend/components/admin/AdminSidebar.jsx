'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart, Users, Phone, UserPlus, LogOut, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const AdminSidebar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <Home className="h-5 w-5" /> },
    { name: 'Analysis', path: '/admin/analysis', icon: <BarChart className="h-5 w-5" /> },
    { name: 'Users', path: '/admin/users', icon: <Users className="h-5 w-5" /> },
    { name: 'Calls', path: '/admin/calls', icon: <Phone className="h-5 w-5" /> },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={cn(
        "bg-sidebar h-screen transition-all duration-300 border-r border-sidebar-border shadow-md",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex justify-between items-center p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="text-xl font-bold text-white">Admin Panel</div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-white hover:bg-sidebar-accent"
        >
          {collapsed ? "→" : "←"}
        </Button>
      </div>

      <div className="p-2">
        <TooltipProvider>
          <nav>
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <li key={item.name}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.path}
                          className={cn(
                            "flex items-center p-3 rounded-lg transition-all",
                            isActive
                              ? "bg-sidebar-primary text-white font-medium shadow-md"
                              : "text-white hover:bg-sidebar-accent hover:text-white",
                            collapsed && "justify-center"
                          )}
                        >
                          {item.icon}
                          {!collapsed && <span className="ml-3">{item.name}</span>}
                        </Link>
                      </TooltipTrigger>
                      {collapsed && (
                        <TooltipContent side="right">{item.name}</TooltipContent>
                      )}
                    </Tooltip>
                  </li>
                );
              })}
            </ul>
          </nav>
        </TooltipProvider>
      </div>

      <div className="absolute bottom-4 w-full px-4">
        <Button
          variant="ghost"
          className={cn(
            "flex items-center w-full p-3 text-white hover:bg-destructive/10 rounded-lg",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
