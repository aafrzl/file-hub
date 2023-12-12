import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useModal } from '@/hooks/useModal';

import React from 'react';
import { Button } from '../ui/button';
import { useUser } from '@clerk/nextjs';
import { deleteDoc, doc } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { deleteObject, ref } from 'firebase/storage';
import toast from 'react-hot-toast';

export default function DeleteModal() {
  const { user } = useUser();

  const [isDeleteModalOpen, setIsDeleteModalOpen, fileId] = useModal(
    (state) => [
      state.isDeleteModalOpen,
      state.setIsDeleteModalOpen,
      state.fileId,
    ]
  );

  async function handleDelete() {
    // eslint-disable-next-line no-useless-return
    if (!user || !fileId) return;

    const toastId = toast.loading('Deleting the file...');

    const fileRef = ref(storage, `users/${user.id}/files/${fileId}`);

    try {
      await deleteObject(fileRef)
        .then(async () => {
          deleteDoc(doc(db, 'users', user.id, 'files', fileId)).then(() => {
            toast.success('File deleted successfully!', { id: toastId });
          });
        })
        .finally(() => {
          setIsDeleteModalOpen(false);
        });
    } catch (error) {
      console.log(error);
      setIsDeleteModalOpen(false);
      toast.error('Something went wrong!', { id: toastId });
    }
  }

  return (
    <Dialog
      open={isDeleteModalOpen}
      onOpenChange={(isOpen) => setIsDeleteModalOpen(isOpen)}>
      <DialogContent className="max-w-sm sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the file.
          </DialogDescription>
        </DialogHeader>
        <div className="flex space-x-2 py-3">
          <Button
            size="sm"
            variant={'ghost'}
            onClick={() => setIsDeleteModalOpen(false)}
            className="flex-1 px-3">
            <span className="sr-only">Cancel</span>
            <span>Cancel</span>
          </Button>

          <Button
            size="sm"
            type="submit"
            variant="destructive"
            className="flex-1 px-3"
            onClick={() => handleDelete()}>
            <span className="sr-only">Delete</span>
            <span>Delete</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
