'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { FileType } from '@/types/file';
import { DataTable } from './Table';
import { columns } from './columns';
import { useUser } from '@clerk/nextjs';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import DeleteModal from '../modals/DeleteModal';
import RenameModal from '../modals/RenameModal';

interface TablesWrapperProps {
  skeletonFiles: FileType[];
}

export default function TablesWrapper({ skeletonFiles }: TablesWrapperProps) {
  const { user } = useUser();
  const [initialFiles, setInitialFiles] = useState<FileType[]>([]);
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');

  const [docs] = useCollection(
    user &&
      query(
        collection(db, 'users', user.id, 'files'),
        orderBy('timestamp', sort)
      )
  );

  useEffect(() => {
    // eslint-disable-next-line no-useless-return
    if (!docs) return;

    const files: FileType[] = docs.docs.map((doc) => ({
      id: doc.id,
      filename: doc.data().filename || doc.id,
      fullname: doc.data().fullname,
      timestamp: new Date(doc.data().timestamp?.seconds * 1000),
      type: doc.data().type,
      size: doc.data().size,
      downloadURL: doc.data().downloadURL,
    }));

    setInitialFiles(files);
  }, [docs]);

  if (docs?.docs.length === undefined) {
    return (
      <div className="flex h-96 items-center justify-center">
        <h2 className="text-2xl">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-5 pb-10">
      <Button
        className="ml-auto w-fit"
        variant={'outline'}
        onClick={() => {
          setSort(sort === 'asc' ? 'desc' : 'asc');
        }}>
        Sort by {sort === 'asc' ? 'newest' : 'oldest'}
      </Button>
      <DeleteModal />
      <RenameModal />
      <DataTable
        columns={columns}
        data={initialFiles}
      />
    </div>
  );
}
