'use client';

import { COLOR_EXTENSTIONS_MAP } from '@/constants';
import { FileType } from '@/types/file';
import { ColumnDef } from '@tanstack/react-table';
import { Link2 } from 'lucide-react';
import Link from 'next/link';
import prettyBytes from 'pretty-bytes';
import { FileIcon, defaultStyles } from 'react-file-icon';

export const columns: ColumnDef<FileType>[] = [
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ renderValue, ...props }) => {
      const type = String(renderValue());
      const extention = type.split('/')[1];
      return (
        <div className="w-10">
          <FileIcon
            extension={extention}
            labelColor={COLOR_EXTENSTIONS_MAP[extention] || '#808080'}
            // @ts-ignore
            {...defaultStyles[extention]}
          />
        </div>
      );
    },
  },
  {
    accessorKey: 'filename',
    header: 'Filename',
  },
  {
    accessorKey: 'timestamp',
    header: 'Date Added',
    cell: ({ renderValue, ...props }) => {
      return (
        <span>
          {new Date(renderValue() as Date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
          {' at '}
          {new Date(renderValue() as Date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      );
    },
  },
  {
    accessorKey: 'size',
    header: 'Size',
    cell: ({ renderValue, ...props }) => {
      return <span>{prettyBytes(Number(renderValue()))}</span>;
    },
  },
  {
    accessorKey: 'downloadURL',
    header: 'Download',
    cell: ({ renderValue, ...props }) => {
      return (
        <Link
          href={String(renderValue())}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600">
          <Link2 />
        </Link>
      );
    },
  },
];
