"use client"
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  BarChart as ChartComponent, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';

const callData = [
  { name: 'Mon', inbound: 40, outbound: 24 },
  { name: 'Tue', inbound: 30, outbound: 45 },
  { name: 'Wed', inbound: 45, outbound: 35 },
  { name: 'Thu', inbound: 50, outbound: 40 },
  { name: 'Fri', inbound: 35, outbound: 30 },
  { name: 'Sat', inbound: 25, outbound: 18 },
  { name: 'Sun', inbound: 15, outbound: 10 },
];

const userActivity = [
  { name: 'Week 1', active: 85, new: 10 },
  { name: 'Week 2', active: 83, new: 8 },
  { name: 'Week 3', active: 90, new: 15 },
  { name: 'Week 4', active: 95, new: 5 },
];

const AnalysisPage = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Analysis Dashboard</h1>
        <Select defaultValue="week">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Last 24 hours</SelectItem>
            <SelectItem value="week">Last week</SelectItem>
            <SelectItem value="month">Last month</SelectItem>
            <SelectItem value="year">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Call Volume Analysis</CardTitle>
            <CardDescription>Inbound vs Outbound calls</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <ChartComponent
                data={callData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="inbound" fill="#8B5CF6" name="Inbound Calls" />
                <Bar dataKey="outbound" fill="#D946EF" name="Outbound Calls" />
              </ChartComponent>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
            <CardDescription>Active and new users over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={userActivity}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="active" 
                  stroke="#8B5CF6" 
                  activeDot={{ r: 8 }}
                  name="Active Users"
                />
                <Line 
                  type="monotone" 
                  dataKey="new" 
                  stroke="#10B981"
                  name="New Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
            <CardDescription>System performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Metric title="Call Success Rate" value="92%" color="bg-admin-primary" />
              <Metric title="System Uptime" value="99.8%" color="bg-green-500" />
              <Metric title="User Engagement" value="78%" color="bg-admin-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Agents</CardTitle>
            <CardDescription>By call success rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "John Smith", rate: "95%" },
                { name: "Maria Garcia", rate: "93%" },
                { name: "Robert Chen", rate: "91%" },
                { name: "Sophia Lee", rate: "89%" },
              ].map((agent, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-admin-secondary flex items-center justify-center font-medium text-admin-primary">
                      {agent.name.charAt(0)}
                    </div>
                    <span>{agent.name}</span>
                  </div>
                  <span className="font-medium">{agent.rate}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Peak Hours</CardTitle>
            <CardDescription>Busiest call times</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-center text-xl font-medium mb-2">10AM - 2PM</div>
              <div className="grid grid-cols-5 gap-1">
                {[45, 60, 90, 75, 40].map((percentage, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="h-24 w-full bg-gray-100 rounded-md relative">
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-admin-primary rounded-md"
                        style={{ height: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs mt-1">{9 + i}h</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Metric = ({ title, value, color }) => (
  <div>
    <div className="flex justify-between mb-1 text-sm">
      <span>{title}</span>
      <span>{value}</span>
    </div>
    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
      <div className={`${color} h-full rounded-full`} style={{ width: value }} />
    </div>
  </div>
);

export default AnalysisPage;
