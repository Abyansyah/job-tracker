'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Settings, Plus, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCategories } from '@/hooks/use-categories';

interface CategoryItem {
  id: number;
  name: string;
  color: string;
  userId: number | null;
}

interface CategoryManagerProps {
  type: 'locations' | 'statuses' | 'sources';
}

export function CategoryManager({ type }: CategoryManagerProps) {
  const { data, mutate } = useCategories(type);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CategoryItem | null>(null);
  const [formData, setFormData] = useState({ name: '', color: '#3B82F6' });

  const getTitle = (capitalized = false) => {
    switch (type) {
      case 'locations':
        return capitalized ? 'Locations' : 'locations';
      case 'statuses':
        return capitalized ? 'Statuses' : 'statuses';
      case 'sources':
        return capitalized ? 'Sources' : 'sources';
      default:
        return capitalized ? 'Categories' : 'categories';
    }
  };

  const handleAdd = () => {
    setFormData({ name: '', color: '#3B82F6' });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (item: CategoryItem) => {
    setSelectedItem(item);
    setFormData({ name: item.name, color: item.color });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (item: CategoryItem) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent, isEditing = false) => {
    e.preventDefault();
    const url = isEditing ? `/api/categories/${type}/${selectedItem?.id}` : `/api/categories/${type}`;
    const method = isEditing ? 'PUT' : 'POST';

    const promise = fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    }).then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Something went wrong');
      }
      return res.json();
    });

    toast.promise(promise, {
      loading: `Saving ${getTitle()}...`,
      success: () => {
        mutate();
        return `${getTitle(true)} saved successfully!`;
      },
      error: (err) => err.message,
    });
  };

  const confirmDelete = async () => {
    const promise = fetch(`/api/categories/${type}/${selectedItem?.id}`, {
      method: 'DELETE',
    }).then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Something went wrong');
      }
      return res.json();
    });

    toast.promise(promise, {
      loading: `Deleting ${getTitle()}...`,
      success: () => {
        mutate();
        return `${getTitle(true)} deleted successfully!`;
      },
      error: (err) => err.message,
    });
  };

  return (
    <>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
            <Settings className="w-3 h-3 mr-1" />
            Manage
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-md mobile-drawer-content">
          <SheetHeader className="flex-shrink-0">
            <SheetTitle>Manage {getTitle(true)}</SheetTitle>
          </SheetHeader>

          <div className="mobile-drawer-scroll custom-scrollbar space-y-4 mt-6">
            {/* Add Button */}
            <Button onClick={handleAdd} className="w-full bg-emerald-500 hover:bg-emerald-600">
              <Plus className="w-4 h-4 mr-2" />
              Add New {getTitle(true).slice(0, -1)}
            </Button>

            {/* Items Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item: CategoryItem) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                          <span className="text-xs text-slate-500">{item.color}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.userId && (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-32" align="end">
                              <div className="space-y-1">
                                <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => handleEdit(item)}>
                                  <Edit className="w-3 h-3 mr-2" />
                                  Edit
                                </Button>
                                <Button variant="ghost" size="sm" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(item)}>
                                  <Trash2 className="w-3 h-3 mr-2" />
                                  Delete
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New {getTitle(true).slice(0, -1)}</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} placeholder="Enter name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <div className="flex items-center space-x-2">
                <Input id="color" type="color" value={formData.color} onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))} className="w-12 h-10 p-1 border rounded" />
                <Input value={formData.color} onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))} placeholder="#3B82F6" className="flex-1" />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600">
                Add
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit {selectedItem?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input id="edit-name" value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} placeholder="Enter name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-color">Color</Label>
              <div className="flex items-center space-x-2">
                <Input id="edit-color" type="color" value={formData.color} onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))} className="w-12 h-10 p-1 border rounded" />
                <Input value={formData.color} onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))} placeholder="#3B82F6" className="flex-1" />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600">
                Update
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedItem?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the {type}"{selectedItem?.name}" from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
