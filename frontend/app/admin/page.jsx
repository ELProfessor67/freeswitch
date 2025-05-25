import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Phone, BarChart, TrendingUp, Clock } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";

const Dashboard = () => {
  return (
  
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
        <p className="text-muted-foreground">Here's what's happening with your admin panel today.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Total Users</CardTitle>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <Users className="h-5 w-5 text-admin-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">128</div>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <p className="text-sm text-green-500">+12% from last month</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Active Calls</CardTitle>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
              <Phone className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <div className="flex items-center mt-1">
              <Clock className="h-4 w-4 text-muted-foreground mr-1" />
              <p className="text-sm text-muted-foreground">Currently in progress</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Call Success</CardTitle>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <BarChart className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">92%</div>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <p className="text-sm text-green-500">+5% from yesterday</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Total Calls</CardTitle>
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
              <Phone className="h-5 w-5 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,842</div>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <p className="text-sm text-green-500">+8% this week</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start space-x-4 border-b pb-4 last:border-0 last:pb-0">
                  <div className={`p-2 rounded-full flex-shrink-0 ${
                    i % 3 === 0 ? 'bg-purple-100 dark:bg-purple-900/30' : 
                    i % 2 === 0 ? 'bg-green-100 dark:bg-green-900/30' : 
                    'bg-blue-100 dark:bg-blue-900/30'
                  }`}>
                    {i % 3 === 0 ? <Users className="h-4 w-4 text-admin-primary" /> : 
                     i % 2 === 0 ? <Phone className="h-4 w-4 text-green-600" /> : 
                     <BarChart className="h-4 w-4 text-blue-600" />}
                  </div>
                  <div>
                    <p className="font-medium">{
                      i % 3 === 0 ? 'User Login' : 
                      i % 2 === 0 ? 'Call Completed' : 
                      'System Update'
                    }</p>
                    <div className="text-sm text-muted-foreground">
                      {i % 3 === 0 ? 'Jane Smith logged in' : 
                       i % 2 === 0 ? 'Call with client ABC ended' : 
                       'System updated to version 2.1.0'} • {30 - i * 5} minutes ago
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-card rounded-lg border border-border">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span>Server Status</span>
                </div>
                <span className="text-green-500 font-medium">Online</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-card rounded-lg border border-border">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span>Database</span>
                </div>
                <span className="text-green-500 font-medium">Healthy</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-card rounded-lg border border-border">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span>SIP Gateway</span>
                </div>
                <span className="text-green-500 font-medium">Connected</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-card rounded-lg border border-border">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span>Last Backup</span>
                </div>
                <span className="text-muted-foreground">Today, 04:30 AM</span>
              </div>
            </div>
          </CardContent>
        </Card>
       
      </div>
    </div>
  );
};

export default Dashboard;
