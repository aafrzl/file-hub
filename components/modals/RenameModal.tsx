'use client';

import { useModal } from '@/hooks/useModal';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';

export default function RenameModal() {
  const { user } = useUser();
  const [input, setInput] = useState<string>('');

  const [isRenameModalOpen, setIsRenameModalOpen, fileId, filename] = useModal(
    (state) => [
      state.isRenameModalOpen,
      state.setIsRenameModalOpen,
      state.fileId,
      state.filename,
    ]
  );

  const renameFile = async () => {
    if (!user || !fileId) return;

    const toastId = toast.loading('Renaming the file...')

    try {
      await updateDoc(doc(db, 'users', user.id, 'files', fileId), {
        filename: input,
      });

      toast.success('File renamed successfully!', {id: toastId});

      setInput('');
      setIsRenameModalOpen(false);
    } catch (error) {
      console.error(error);
      setIsRenameModalOpen(false);
      toast.error('Something went wrong!', {id: toastId});
    }
  };

  return (
    <Dialog
      open={isRenameModalOpen}
      onOpenChange={(isOpen) => setIsRenameModalOpen(isOpen)}>
      <DialogContent>
        <DialogHeader className="pb-2">Rename the File</DialogHeader>
        <Input
          id="link"
          defaultValue={filename}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              renameFile();
            }
          }}
        />

        <div className="flex justify-end space-x-2 py-3">
          <Button
            size="sm"
            className="flex-1 px-3"
            variant="ghost"
            onClick={() => setIsRenameModalOpen(false)}>
            <span className="sr-only">Cancel</span>
            <span>Cancel</span>
          </Button>

          <Button
            size="sm"
            type="submit"
            className="flex-1 px-3"
            variant="destructive"
            onClick={() => renameFile()}>
            <span className="sr-only">Rename</span>
            <span>Rename</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
