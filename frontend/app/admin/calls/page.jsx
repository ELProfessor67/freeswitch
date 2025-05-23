'use client';

import React from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const callData = [
  { id: '1', type: 'Inbound', from: '+1 (555) 123-4567', to: 'Support Agent 1', duration: '3:24', status: 'Completed', date: '2024-05-20 09:12:34' },
  { id: '2', type: 'Outbound', from: 'Sales Agent 3', to: '+1 (555) 987-6543', duration: '1:52', status: 'Completed', date: '2024-05-20 10:15:22' },
  { id: '3', type: 'Inbound', from: '+1 (555) 111-2222', to: 'Support Agent 2', duration: '7:41', status: 'Completed', date: '2024-05-20 11:30:45' },
  { id: '4', type: 'Outbound', from: 'Sales Agent 1', to: '+1 (555) 333-4444', duration: '0:45', status: 'No Answer', date: '2024-05-20 13:05:18' },
  { id: '5', type: 'Inbound', from: '+1 (555) 555-5555', to: 'Support Agent 3', duration: '5:12', status: 'Completed', date: '2024-05-20 14:22:51' },
  { id: '6', type: 'Inbound', from: '+1 (555) 666-7777', to: 'Support Agent 1', duration: '2:38', status: 'Completed', date: '2024-05-20 15:47:33' },
  { id: '7', type: 'Outbound', from: 'Sales Agent 2', to: '+1 (555) 888-9999', duration: '0:12', status: 'Dropped', date: '2024-05-20 16:14:05' },
];

const Calls = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [callsPerPage] = React.useState(5);
  const [filter, setFilter] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredCalls = React.useMemo(() => {
    let result = [...callData];
    if (filter !== 'all') {
      result = result.filter(call => call.type.toLowerCase() === filter);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(call =>
        call.from.toLowerCase().includes(query) ||
        call.to.toLowerCase().includes(query) ||
        call.status.toLowerCase().includes(query)
      );
    }
    return result;
  }, [filter, searchQuery]);

  const indexOfLastCall = currentPage * callsPerPage;
  const indexOfFirstCall = indexOfLastCall - callsPerPage;
  const currentCalls = filteredCalls.slice(indexOfFirstCall, indexOfLastCall);
  const totalPages = Math.ceil(filteredCalls.length / callsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Call Records</h1>

      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="w-full md:w-64">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter calls" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Calls</SelectItem>
              <SelectItem value="inbound">Inbound Only</SelectItem>
              <SelectItem value="outbound">Outbound Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search calls..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Call Type</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date & Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentCalls.map((call) => (
                <TableRow key={call.id}>
                  <TableCell>
                    <div className={`flex items-center gap-2 ${call.type === 'Inbound' ? 'text-green-600' : 'text-blue-600'}`}>
                      {call.type === 'Inbound' ? '→' : '←'} {call.type}
                    </div>
                  </TableCell>
                  <TableCell>{call.from}</TableCell>
                  <TableCell>{call.to}</TableCell>
                  <TableCell>{call.duration}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      call.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : call.status === 'No Answer'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {call.status}
                    </span>
                  </TableCell>
                  <TableCell>{call.date}</TableCell>
                </TableRow>
              ))}

              {currentCalls.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No calls found matching the criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {filteredCalls.length > callsPerPage && (
            <div className="py-4 border-t">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={handlePreviousPage}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={currentPage === page}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={handleNextPage}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Calls;
