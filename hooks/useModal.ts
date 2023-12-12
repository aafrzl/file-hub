import { create } from 'zustand';

interface IModalState {
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (isOpen: boolean) => void;

  isRenameModalOpen: boolean;
  setIsRenameModalOpen: (isOpen: boolean) => void;

  fileId: string | null;
  setFileId: (fileId: string) => void;

  filename: string;
  setFilename: (filename: string) => void;
}

export const useModal = create<IModalState>((set) => ({
  isDeleteModalOpen: false,
  setIsDeleteModalOpen: (isOpen) =>
    set((state) => ({ isDeleteModalOpen: isOpen })),

  isRenameModalOpen: false,
  setIsRenameModalOpen: (isOpen) =>
    set((state) => ({ isRenameModalOpen: isOpen })),

  fileId: null,
  setFileId: (fileId) => set((state) => ({ fileId })),

  filename: '',
  setFilename: (filename) => set((state) => ({ filename })),
}));
