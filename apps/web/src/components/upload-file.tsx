'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader, Trash2 } from 'lucide-react';

interface UploadFileProps {
  onUploadSuccess: (cid: string) => void;
}

export function UploadFile({ onUploadSuccess }: UploadFileProps) {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [selectedFileName, setSelectedFileName] = useState<string | undefined>(
    undefined,
  );
  const [uploading, setUploading] = useState(false);

  const uploadFile = async () => {
    try {
      if (!file) {
        toast.error('No file selected!');
        return;
      }

      setUploading(true);
      const data = new FormData();
      data.set('file', file);
      const uploadRequest = await fetch('/api/files', {
        method: 'POST',
        body: data,
      });
      const res = await uploadRequest.json();
      console.log('Uploaded CID:', res);
      onUploadSuccess(res);
      setUploading(false);
      if (res) {
        toast.success('File uploaded successfully!');
      }
    } catch (e) {
      console.error('Trouble uploading file:', e);
      setUploading(false);
      alert('Trouble uploading file');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target?.files?.[0];
    if (selectedFile && selectedFile.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed.');
      e.target.value = ''; // Clear the input
      setFile(undefined);
      setSelectedFileName(undefined);
      return;
    }
    setFile(selectedFile);
    setSelectedFileName(selectedFile ? selectedFile.name : undefined);
  };

  const handleDeleteFile = () => {
    setFile(undefined);
    setSelectedFileName(undefined);
    // Optionally, clear the file input value if needed
    const fileInput = document.getElementById(
      'file-upload-input',
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    toast.info('Selected file cleared.');
  };

  return (
    <section className='w-full flex flex-col space-y-2'>
      <div className='flex items-center space-x-2'>
        <Input
          id='file-upload-input'
          type='file'
          accept='.pdf'
          onChange={handleChange}
          className='flex-grow'
        />
        {selectedFileName && (
          <Button
            type='button'
            size='icon'
            variant='destructive'
            onClick={handleDeleteFile}
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        )}
      </div>
      {selectedFileName && (
        <p className='text-sm text-gray-500'>
          Selected file: {selectedFileName}
        </p>
      )}
      <Button
        className='cursor-pointer'
        type='button'
        disabled={uploading || !file}
        onClick={uploadFile}
      >
        {uploading ? (
          <Loader className='h-4 w-4 animate-spin' />
        ) : (
          'Upload File'
        )}
      </Button>
    </section>
  );
}
