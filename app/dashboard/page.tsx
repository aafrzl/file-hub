import DropzoneComponent from '@/components/DropzoneComponent';
import TablesWrapper from '@/components/tables/TableWrapper';
import { db } from '@/lib/firebase';
import { FileType } from '@/types/file';
import { auth } from '@clerk/nextjs';
import { collection, getDocs } from 'firebase/firestore';
import React from 'react';

export default async function DashboardPage() {
  const { userId } = auth();

  const docsResult = await getDocs(collection(db, 'users', userId!, 'files'));

  const skeletonFiles: FileType[] = docsResult.docs.map((docs) => ({
    id: docs.id,
    filename: docs.data().filename || docs.id,
    fullname: docs.data().fullname,
    timestamp: new Date(docs.data().timestamp?.seconds * 1000),
    type: docs.data().type,
    size: docs.data().size,
    downloadURL: docs.data().downloadURL,
  }));

  return (
    <main>
      <DropzoneComponent />
      <section className="container mx-auto space-y-2">
        <h2 className="text-xl font-bold uppercase">All files</h2>
        <div>
          <TablesWrapper skeletonFiles={skeletonFiles} />
        </div>
      </section>
    </main>
  );
}
