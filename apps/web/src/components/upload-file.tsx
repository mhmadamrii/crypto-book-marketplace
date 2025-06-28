'use client';

import { useState } from 'react';

interface UploadFileProps {
  onUploadSuccess: (cid: string) => void;
}

export function UploadFile({ onUploadSuccess }: UploadFileProps) {
  const [file, setFile] = useState<File>();
  const [uploading, setUploading] = useState(false);

  const uploadFile = async () => {
    try {
      if (!file) {
        alert('No file selected');
        return;
      }

      setUploading(true);
      const data = new FormData();
      data.set('file', file);
      const uploadRequest = await fetch('/api/files', {
        method: 'POST',
        body: data,
      });
      const { cid } = await uploadRequest.json();
      console.log('Uploaded CID:', cid);
      onUploadSuccess(cid);
      setUploading(false);
    } catch (e) {
      console.error('Trouble uploading file:', e);
      setUploading(false);
      alert('Trouble uploading file');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target?.files?.[0]);
  };

  return (
    <section className='w-full flex flex-col justify-center items-center'>
      <input type='file' onChange={handleChange} />
      <button
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md cursor-pointer'
        type='button'
        disabled={uploading}
        onClick={uploadFile}
      >
        {uploading ? 'Uploading...' : 'Upload File'}
      </button>
    </section>
  );
}
