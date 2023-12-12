'use client';

import { db, storage } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import toast from 'react-hot-toast';

export default function DropzoneComponent() {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  // function ondrop
  const onDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');

      reader.onload = async () => {
        await uploadPost(file);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  // function uploadPost
  const uploadPost = async (file: File) => {
    if (loading) return;
    // eslint-disable-next-line no-useless-return
    if (!user) return;

    setLoading(true);

    const toastId = toast.loading('Upload the file...');

    try {
      const docRef = await addDoc(collection(db, 'users', user.id, 'files'), {
        userId: user.id,
        filename: file.name,
        fullname: user.fullName,
        profileImg: user.imageUrl,
        timestamp: serverTimestamp(),
        type: file.type,
        size: file.size,
      });

      const imageRef = ref(storage, `users/${user.id}/files/${docRef.id}`);

      await uploadBytes(imageRef, file).then(async (snapshot) => {
        const downloadURL = await getDownloadURL(snapshot.ref);

        await updateDoc(doc(db, 'users', user.id, 'files', docRef.id), {
          downloadURL,
        });
      });

      toast.success('File uploaded successfully!', { id: toastId });

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error('Something went wrong!', { id: toastId });
    }
  };

  // 10MB max file size
  const maxSize = 10485760;

  return (
    <Dropzone
      minSize={0}
      maxSize={maxSize}
      onDrop={(acceptedFiles) => onDrop(acceptedFiles)}>
      {({
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject,
        fileRejections,
      }) => {
        const isFileTooLarge =
          fileRejections.length > 0 && fileRejections[0].file.size > maxSize;
        return (
          <section className="m-6 cursor-pointer">
            <div
              {...getRootProps()}
              className={cn(
                'w-full h-52 flex justify-center items-center border-2 border-dashed rounded-xl text-center p-6',
                isDragActive
                  ? 'border-blue-500 animate-pulse'
                  : 'border-zinc-600/30'
              )}>
              <input {...getInputProps()} />
              {isDragActive && <p>All files will be accept</p>}
              {isDragReject && <p>Some files will be rejected</p>}
              {!isDragActive && !isDragReject && (
                <p>Drop some files here, or click to select files</p>
              )}
              {isFileTooLarge && (
                <div className="mt-2 text-rose-500">
                  File is too large. Max file size is 10MB.
                </div>
              )}
            </div>
          </section>
        );
      }}
    </Dropzone>
  );
}
