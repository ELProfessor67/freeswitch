import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { Bell, Moon, Sun } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AdminSidebar from '@/components/admin/AdminSidebar';

const layout = ({ children }) => {
    return (

        <div className="flex h-screen bg-background">
            <AdminSidebar />
            <div className="flex-1 overflow-auto">
                <header className=" bg-white shadow-sm p-4 sticky top-0 z-10">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-foreground hover:text-admin-primary"
                            >
                                <Sun className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-foreground hover:text-admin-primary"
                            >
                                <Bell className="h-5 w-5" />
                            </Button>
                            <div className="relative flex items-center gap-2">
                                <span className="text-sm font-medium hidden sm:block">Admin User</span>
                                <div className="h-8 w-8 rounded-full bg-admin-primary flex items-center justify-center text-white">
                                    A
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="p-6 z-0 relative ">
                   {children}
                </main>
            </div>
        </div>

    )
}

export default layout