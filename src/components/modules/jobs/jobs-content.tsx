'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { JobForm } from './jobs-form';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, ExternalLink, Building, MapPin, X } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useJobs } from '@/hooks/use-jobs';
import { toast } from 'sonner';
import { useCategories } from '@/hooks/use-categories';

export default function JobsContent() {
  const { data: locations } = useCategories('locations');
  const { data: statuses } = useCategories('statuses');
  const { data: sources } = useCategories('sources');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const [filters, setFilters] = useState({
    location: '',
    status: '',
    source: '',
  });
  const combinedFilters = { searchTerm, ...filters };
  const { jobs, isLoading, mutate } = useJobs(combinedFilters);

  const handleFilterChange = (type: 'location' | 'status' | 'source', value: string) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({ location: '', status: '', source: '' });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleEdit = (job: any) => {
    setSelectedJob(job);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedJob(null);
    setIsFormOpen(true);
  };

  const handleDelete = (jobId: number) => {
    const promise = fetch(`/api/jobs/${jobId}`, { method: 'DELETE' }).then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Something went wrong');
      }
      return res.json();
    });

    toast.promise(promise, {
      loading: 'Deleting job...',
      success: () => {
        mutate();
        return 'Job deleted successfully!';
      },
      error: (err) => err.message,
    });
  };

  const totalEntries = jobs.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentJobs = jobs.slice(startIndex, endIndex);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Daftar Lamaran</h1>
        <Button className=" bg-emerald-500 hover:bg-emerald-600" onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Lamaran
        </Button>
      </div>

      <Card className="bg-white rounded-xl shadow-sm border-slate-200">
        <CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input placeholder="Cari perusahaan atau posisi..." value={searchTerm} onChange={handleSearchChange} className="pl-10" />
            </div>
            <Select value={filters.location} onValueChange={(value) => handleFilterChange('location', value === 'all' ? '' : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Semua Lokasi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Lokasi</SelectItem>
                {locations.map((loc: any) => (
                  <SelectItem key={loc.id} value={loc.name}>
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                {statuses.map((stat: any) => (
                  <SelectItem key={stat.id} value={stat.name}>
                    {stat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filters.source} onValueChange={(value) => handleFilterChange('source', value === 'all' ? '' : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Semua Sumber" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Sumber</SelectItem>
                {sources.map((src: any) => (
                  <SelectItem key={src.id} value={src.name}>
                    {src.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="ghost" onClick={resetFilters} className="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 lg:col-span-5 justify-center">
              <X className="w-4 h-4 mr-2" />
              Reset Semua Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Perusahaan</TableHead>
                  <TableHead>Posisi</TableHead>
                  <TableHead>Tanggal Melamar</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : (
                  currentJobs.map((job: any) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                            <Building className="w-4 h-4 text-emerald-600" />
                          </div>
                          {job.company}
                        </div>
                      </TableCell>
                      <TableCell>{job.position}</TableCell>
                      <TableCell>{format(new Date(job.applicationDate), 'dd MMM yyyy', { locale: id })}</TableCell>
                      <TableCell>
                        <Badge style={{ backgroundColor: job.statusColor, color: '#fff' }}>{job.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 text-slate-400 mr-1" />
                          {job.location}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-48" align="end">
                            <div className="space-y-1">
                              <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => handleEdit(job)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                              <a href={job.url} target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="sm" className="w-full justify-start">
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  Buka Link
                                </Button>
                              </a>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Hapus
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action will permanently delete the job application for {job.position} at {job.company}.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(job.id)}>Delete</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {/* Pagination Controls */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t">
            <span className="text-sm text-slate-600">
              Showing {startIndex + 1} to {Math.min(endIndex, totalEntries)} of {totalEntries} entries
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedJob ? 'Edit Lamaran' : 'Tambah Lamaran Baru'}</DialogTitle>
          </DialogHeader>
          <JobForm initialData={selectedJob} onClose={() => setIsFormOpen(false)} mutate={mutate} />
        </DialogContent>
      </Dialog>
    </>
  );
}
